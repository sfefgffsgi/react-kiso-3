import { useEffect, Dispatch, SetStateAction } from "react";

type PagenationParams = {
  offset: number;
  setOffset: Dispatch<SetStateAction<number>>;
  onClickFunction: VoidFunction;
  retData?: string[];
  dataLength?: number;
  revMode?: boolean;
};

export const Pagination = ({
  offset,
  setOffset,
  onClickFunction,
  retData = [],
  dataLength = 10,
  revMode = false,
}: PagenationParams) => {
  let className = "pagination";
  let disabledPrev = false;
  let disabledNext = false;
  if (offset <= 0) {
    if (revMode) {
      disabledNext = true;
    } else {
      disabledPrev = true;
    }
  }

  if (retData.length != dataLength) {
    if (revMode) {
      disabledPrev = true;
    } else {
      disabledNext = true;
    }
  }

  useEffect(() => {
    onClickFunction();
  }, [offset]);

  return (
    <div className={className}>
      <button
        onClick={() => {
          if (revMode) {
            setOffset(offset + dataLength);
          } else {
            setOffset(offset - dataLength);
          }
        }}
        disabled={disabledPrev}
      >
        Prev
      </button>
      <button
        onClick={() => {
          if (revMode) {
            setOffset(offset - dataLength);
          } else {
            setOffset(offset + dataLength);
          }
        }}
        disabled={disabledNext}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
