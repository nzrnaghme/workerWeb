import React from 'react';
import { toPersianNumber } from '../hooks/persianHelper';

type props = {
    score: number,
    showDetailScore?: boolean,
    className?:string
}

function ResaultScore({ score ,className}: props) {

    return (
      <>
        <div className={className} style={{ color: "#1C97D7", padding: "6px" }}>
          {toPersianNumber(score)}
        </div>
      </>
    );
}

export default ResaultScore
