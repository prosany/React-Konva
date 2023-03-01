import { useEffect, useRef } from "react";
import { Stage, Layer, Rect, Line, Transformer } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import {
  createDragg,
  startDraggingEnd,
  startTransform,
  startSelect,
} from "global/imagePositions/actions";

const ImageCanvas = (props) => {
  const { image, determined, cords } = props;
  const dispatch = useDispatch();
  const imagePositions = useSelector((state) => state?.imagePositions);
  const { position, size, rotation, selected } = imagePositions;
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (selected) {
      // we need to attach transformer manually
      trRef?.current?.nodes([shapeRef.current]);
      trRef?.current?.getLayer().batchDraw();
    }
  }, [selected]);

  const handleDragEnd = (e) => {
    dispatch(startDraggingEnd({ x: e.target.x(), y: e.target.y() }));
  };

  const handleTransform = (e) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const newWidth = node.width() * scaleX;
    const newHeight = node.height() * scaleY;

    dispatch(
      startTransform({
        width: newWidth,
        height: newHeight,
        rotation: node.rotation(),
      })
    );
  };

  const dragg = (position) => {
    dispatch(
      createDragg({
        x: position.x,
        y: position.y,
        width: position.width,
        height: position.height,
        rotation: position.rotation,
      })
    );
    trRef?.current?.nodes([shapeRef.current]);
    trRef?.current?.getLayer()?.batchDraw();
  };

  const pickOut = (event) => {
    const clickedOnEmpty = event.target === event.target.getStage();
    if (clickedOnEmpty) {
      dispatch(startSelect(0));
    }
  };

  return (
    <div
      className="relative w-full h-[350px] rounded bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(${image})` }}
    >
      <p className="absolute left-1/2 -top-6 text-gray-700 text-sm font-medium">
        {cords[0]}
      </p>
      <p className="absolute top-1/2 -right-4 text-gray-700 text-sm font-medium">
        {cords[1]}
      </p>
      <p className="absolute top-1/2 -left-4 text-gray-700 text-sm font-medium">
        {cords[3]}
      </p>
      <p className="absolute left-1/2 -bottom-6 text-gray-700 text-sm font-medium">
        {cords[2]}
      </p>
      <Stage
        width={350}
        height={350}
        onMouseDown={pickOut}
        onTouchStart={pickOut}
      >
        <Layer>
          <Rect
            x={position.x}
            y={position.y}
            width={size.width}
            height={size.height}
            fill="transparent"
            stroke="yellow"
            strokeWidth={2}
            ref={shapeRef}
            onClick={() => dispatch(startSelect(determined))}
            onDragEnd={handleDragEnd}
            onTransformEnd={(e) => {
              const node = e.target;
              const scaleX = node.scaleX();
              const scaleY = node.scaleY();

              const rotation = node.rotation();

              // we will reset it back
              node.scaleX(1);
              node.scaleY(1);
              dragg({
                x: node.x(),
                y: node.y(),
                rotation: rotation,
                width: Math.max(5, node.width() * scaleX),
                height: Math.max(node.height() * scaleY),
              });
            }}
            rotation={rotation}
            offsetX={size.width / 2}
            offsetY={size.height / 2}
            draggable
          />
          <Line
            x={position.x}
            y={position.y}
            points={[-(size.width / 2), 0, size.width / 2, 0]}
            stroke="yellow"
            strokeWidth={2}
            rotation={rotation}
          />
          {selected === determined && (
            <Transformer
              ref={trRef}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 5 || newBox.height < 5) return oldBox;

                newBox.width = Math.max(30, newBox.width);
                newBox.height = Math.max(30, newBox.height);
                return newBox;
              }}
              onTransform={handleTransform}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default ImageCanvas;

export const Rects = () => {
  return <div></div>;
};
