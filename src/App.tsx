import React, { useState, useLayoutEffect } from 'react';
import 'semantic-ui-css/semantic.min.css'

import { Container, Grid, Button, Segment } from 'semantic-ui-react';
import { MenuBar } from './components/MenuBar';
import { usePdf, Pdf } from './hooks/usePdf';
import { AttachmentTypes } from './entities';
import { ggID } from './utils/helpers';
import { useAttachments } from './hooks/useAttachments';
import { useUploader, UploadTypes } from './hooks/useUploader';
import { Empty } from './components/Empty';
import { Page } from './components/Page';
import { Attachments } from './components/Attachments';

const App: React.FC<{}> = () => {
    const { file, initialize, pageIndex, isMultiPage, isFirstPage, isLastPage, currentPage, isSaving, savePdf, previousPage, nextPage, setDimensions, name, dimensions } = usePdf();
    const { add: addAttachment, allPageAttachments, pageAttachments, reset: resetAttachments, update, remove, setPageIndex } = useAttachments();
    
    const initializePageAndAttachments = (pdfDetails: Pdf) => {
      initialize(pdfDetails);
      const numberOfPages = pdfDetails.pages.length;
      resetAttachments(numberOfPages);
    };
    
    const { inputRef: pdfInput, handleClick: handlePdfClick, isUploading, onClick, upload: uploadPdf } = useUploader({ 
      use: UploadTypes.PDF,
      afterUploadPdf: initializePageAndAttachments,
   });
    const { inputRef: imageInput, handleClick: handleImageClick, onClick: onImageClick, upload: uploadImage  } = useUploader({ 
      use: UploadTypes.IMAGE,
      afterUploadAttachment: addAttachment,
    });

    const addText = () => {
        const newTextAttachment: TextAttachment = {
            id: ggID(),
            type: AttachmentTypes.TEXT,
            x: 0,
            y: 0,
            width: 120,
            height: 25,
            size: 16,
            lineHeight: 1.4,
            fontFamily: 'Times-Roman',
            text: 'Enter Text Here',
        };
        addAttachment(newTextAttachment);
    };

    useLayoutEffect(() => setPageIndex(pageIndex), [pageIndex, setPageIndex]);

    const hiddenInputs = (
      <>
        <input
          ref={pdfInput}
          type="file"
          name="pdf"
          id="pdf"
          accept="application/pdf"
          onChange={uploadPdf}
          onClick={onClick}
          style={{ display: 'none' }} 
        />
        <input
              ref={imageInput}
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onClick={onImageClick}
              style={{ display: 'none' }}
              onChange={uploadImage} 
        />
      </>
    )

    const handleSavePdf = () => savePdf(allPageAttachments);

    return (
        <Container 
            style={{ margin: 30 }}
        >
            { hiddenInputs }
            <MenuBar
                savePdf={handleSavePdf}
                addText={addText}
                addImage={handleImageClick}
                savingPdfStatus={isSaving}
                uploadNewPdf={handlePdfClick}
                isPdfLoaded={!!file}
            />

            { !file ? (
                <Empty
                    loading={isUploading}
                    uploadPdf={handlePdfClick}
                />
            ) : (
                <Grid>
                <Grid.Row>
                  <Grid.Column width={3} verticalAlign="middle" textAlign="left">
                    {isMultiPage && !isFirstPage && (
                      <Button circular icon="angle left" onClick={previousPage} />
                    )}
                  </Grid.Column>
                  <Grid.Column width={10}>
                      { currentPage && (
                        <Segment
                        compact
                        stacked={isMultiPage && !isLastPage}
                      >
                        <div 
                          style={{ position: 'relative' }}
                        >
                          <Page
                            dimensions={dimensions}
                            updateDimensions={setDimensions}
                            page={currentPage} 
                          />
                          { dimensions && (
                            <Attachments
                              pdfName={name}
                              removeAttachment={remove}
                              updateAttachment={update}
                              pageDimensions={dimensions}
                              attachments={pageAttachments}
                            /> 
                          )}
                        </div>
                      </Segment>
                      )}
                        
                  </Grid.Column>
                  <Grid.Column width={3} verticalAlign="middle" textAlign="right">
                    {isMultiPage && !isLastPage && (
                      <Button circular icon="angle right" onClick={nextPage}/>
                    )}
                  </Grid.Column>
                </Grid.Row>
            </Grid>
            )}
        </Container>
    );
}

export default App;