import React, { useState, useEffect } from "react";
import "./index.scss";
import Divider from "@material-ui/core/Divider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMale,
  faFemale,
  faClock,
  faComments,
  faHandshake,
  faTransgender,
  faTransgenderAlt,
  faMarsStroke,
  faMapMarkerAlt,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import Paper from "../../../Components/Paper";
import { ScoreStars } from "../../../Components/Score";
import Button from "../../../Components/Button";
import { truncateString } from "../../../Components/hooks/stringHelper";
import { toPersianNumber } from "../../../Components/hooks/persianHelper";
import { Gender } from "../../../Models/Enums";
import HeaderItem from "../../../Components/ReqPaperHeaderItem";
import { genderNameMaker } from "../../../Components/hooks/genderHelper";
import { IRequestInSearch } from "../Entites";

type Props = {
  item: IRequestInSearch;
  callBackAddRequest: (id: string, userId: string) => void;
};

function RequestSearchPaper({ item, callBackAddRequest }: Props) {

  const ShowDateTime = () => {
    if (item.beginTime != null && item.beginDate != null) {
      return (
        <>
          <span>{toPersianNumber(item.beginDate)}</span>-
          <span>{toPersianNumber(item.beginTime)}</span>
        </>
      );
    }
    return;
  };

  const persianText = (text: any) => {
    if (text) {
      return toPersianNumber(text);
    }
    return "";
  };

  const RegionFiled = () => {
    if (item.region != null) {
      return item.region[0];
    }
    return "ایران";
  };

  const genderIconIdentifier = (gender: Gender | undefined) => {
    switch (gender) {
      case Gender.Male:
        return faMale;
      case Gender.Female:
        return faFemale;
      case Gender.Transgender:
        return faTransgender;
      case Gender.Transwoman:
        return faTransgenderAlt;
      case Gender.Transman:
        return faMarsStroke;
    }
  };

  return (
    <Paper className="request-paper">
      <header className="req-paper-header">
        <div className="score-container">
          <div className="stars-num-wrapper">
            <ScoreStars value={item.clientScore} size="small" />
            <span className="r-p-user-score-num">
              {toPersianNumber(item.clientScore)}
            </span>
          </div>
          <HeaderItem icon={genderIconIdentifier(item.gender)}>
            {genderNameMaker(item.gender)}
          </HeaderItem>
        </div>
        <div className="req-header-items-wrapper">
          <HeaderItem
            icon={faBell}
            iconClassName={
              item.requestType === 1 ? "myreqs-req-paper-emergent-icon" : ""
            }
          >
            {item.requestType === 1 ? "فوری" : "عادی"}
          </HeaderItem>
          <HeaderItem icon={item.presenceType ? faHandshake : faComments}>
            {item.presenceType === 0 ? "حضوری" : "غیرحضوری"}
          </HeaderItem>
          <HeaderItem icon={faClock}>
            <div className="req-paper-date-time">{ShowDateTime()}</div>
          </HeaderItem>
        </div>
      </header>
      <Divider className="req-paper-main-divider" />
      <main className="req-paper-main">
        <p className="req-paper-title">{toPersianNumber(item.title)}</p>
        <p className="req-paper-description">
          {truncateString(persianText(item.content), 60)}
        </p>
        <footer className="req-paper-footer-wrapper">
          <span className="req-paper-location-wrapper">
            <FontAwesomeIcon id="location-icon" icon={faMapMarkerAlt} />
            <p className="req-paper-location">{RegionFiled()}</p>
          </span>
          <Button
            label="جزییات"
            onClick={() => {
              callBackAddRequest(item.requestRegistrationId, item.userId);
            }}
          />
        </footer>
      </main>
    </Paper>
  );
}

export default RequestSearchPaper;
