import { lazy, memo } from "react";
import { useSelector } from "react-redux";
const ImageCanvas = lazy(() => import("components/imagePositions/imageCanvas"));
const NoParameter = lazy(() => import("components/notFound/NoParameter"));

const ImagePositions = () => {
  const storedActivity = useSelector((state) => state?.storedActivity);
  const { selectedActivity } = storedActivity;
  const { paramter_image1, paramter_image2, paramter_image3 } =
    selectedActivity;

  return (
    <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1">
      <div className="lg:w-[90%] md:w-[90%] w-[100%] px-4 py-6">
        {paramter_image1?.length > 5 ? (
          <ImageCanvas
            image={paramter_image1}
            determined={1}
            cords={["H", "P", "F", "A"]}
          />
        ) : (
          <NoParameter />
        )}
      </div>
      <div className="lg:w-[90%] md:w-[90%] w-[100%] px-4 py-6">
        {paramter_image2?.length > 5 ? (
          <ImageCanvas
            image={paramter_image2}
            determined={2}
            cords={["A", "L", "P", "R"]}
          />
        ) : (
          <NoParameter />
        )}
      </div>
      <div className="lg:w-[90%] md:w-[90%] w-[100%] px-4 py-6">
        {paramter_image3?.length > 5 ? (
          <ImageCanvas
            image={paramter_image3}
            determined={3}
            cords={["H", "L", "F", "R"]}
          />
        ) : (
          <NoParameter />
        )}
      </div>
    </div>
  );
};

export default memo(ImagePositions);
// flex lg:justify-between md:justify-between sm:justify-center items-center flex-wrap
