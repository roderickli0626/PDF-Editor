import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import { Image as Component } from '../components/Image';
import { Position, ResizableDelta, Rnd } from 'react-rnd';
import { DraggableData, DraggableEvent } from 'react-draggable';
import { Direction } from 're-resizable/lib/resizer';
import { BsFillCircleFill, BsXCircleFill } from 'react-icons/all';
import { Stone } from '../components/Stone';
import { Translate, useDraggable } from '@dnd-kit/core';
import { Resizable, ResizeCallback } from 're-resizable';

interface Props {
  pageWidth: number;
  pageHeight: number;
  removeImage?: () => void;
  resizeImage?: (width: number, height: number) => void;
  hidden?: boolean;
  x:number;
  y:number;
}

export const DraggableImage = (
  {
  id,
  img,
  width,
  height,
  pageWidth,
  removeImage,
  pageHeight,
    hidden=false,
    x,
    y,
    resizeImage,
}: ImageAttachment & Props) => {
  const {attributes: draggableAttrs, isDragging, listeners, setNodeRef} = useDraggable({
    id,
  });

  const onResizeStop : ResizeCallback = (e, direction, ref, d)=>{
      function strToInt(strPx: string): number{
        const strInt= strPx.replace('px','')
        const int= parseInt(strInt)
        if(int){
          return int
        }else{
          throw new Error(strPx+ " can't parse to int: " + int + "when parse "+ strInt)
        }
      }

      if(resizeImage)
        resizeImage(strToInt(ref.style.width), strToInt(ref.style.height));
  }

  const deleteButton =
    <Stone
      position={{
        left: 0,
        top: 0,
        right: 0,
      }}
      translateX={"0"}
      translateY={"-50%"}
      style={{
        backgroundColor: 'white',
      }}
    >
      <BsXCircleFill
        onClick={removeImage}
        style={{
          cursor: 'pointer',
          color:'rgb(245, 101, 101)',
          width: "100%",
          height: "100%",
        }}/>
    </Stone>

  const stone =
    <BsFillCircleFill
      style={{
        color:'#90cdf4',
        width: "100%",
        height: "100%",
      }}
    />

  const leftTop =
    <Stone
      position={{
        left: 0,
        top: 0,
      }}
      translateX={"-50%"}
      translateY={"-50%"}
    >
      {stone}
    </Stone>

  const rightTop =
    <Stone
      position={{
        right: 0,
        top: 0,
      }}
      translateX={"50%"}
      translateY={"-50%"}
    >
      {stone}
    </Stone>

  const leftBottom =
    <Stone
      position={{
        left: 0,
        bottom: 0,
      }}
      translateX={"-50%"}
      translateY={"50%"}
    >
      {stone}
    </Stone>

  const rightBottom =
    <Stone
      position={{
        right: 0,
        bottom: 0,
      }}
      translateX={"50%"}
      translateY={"50%"}
    >
      {stone}
    </Stone>

  let imageStyle: CSSProperties = {
    border:'0.3px dashed gray',
    cursor: 'move',
  }

  const hiddenStyle: CSSProperties = hidden
    ? {visibility: 'hidden',}
    : {}

  return (
      <Resizable
        size={{
          width,
          height,
        }}
        onResizeStop={onResizeStop}
        style={{
          position: "absolute",
          'left': `${x ?? 0}px`,
          'top': `${y ?? 0}px`,
          ...hiddenStyle,
        }}
      >
        {removeImage && deleteButton}
        {leftTop}
        {rightTop}
        {leftBottom}
        {rightBottom}
        <Component
          ref={setNodeRef}
          listeners={listeners}
          draggableAttrs={draggableAttrs}
          style={imageStyle}
          img={img}/>
      </Resizable>
  );
};
