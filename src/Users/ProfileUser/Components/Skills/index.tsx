import { useState, useEffect } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "./index.scss";
import Paper from "../../../../Components/Paper";
import TextField from "../../../../Components/Inputs/TextField";
import Button from "../../../../Components/Button";
import Autocomplete from "../../../../Components/Inputs/MultiAutoComplete";
import { IUserInfo } from "../../Entities";
import { IdropDownModel } from "../../../../Components/Inputs/DropDown";

type Props = {
  personalData: IUserInfo | undefined;
  UpdateCreditCards: (
    serviceCategoryIds: string[] | undefined,
    skill: string | undefined
  ) => void;
  skillCatOptions: IdropDownModel[];
};

function Skill({ UpdateCreditCards, personalData, skillCatOptions }: Props) {
  const matchesSm = useMediaQuery("(max-width:40rem)");
  const [selectedSkills, setSelectedSkills] = useState<
    IdropDownModel[] | undefined
  >([]);
  const [suggestedSkillCats, setSuggestedSkillCats] = useState("");

  useEffect(() => {
    if (personalData != null) {
      if (
        personalData.serviceCategoryIds != null &&
        skillCatOptions.length > 0
      ) {
        const skilld = personalData.serviceCategoryIds.map((i) => {
          return skillCatOptions.find((option) => option.id === i);
        });
        setSelectedSkills(skilld as IdropDownModel[]);
      }
      if (
        personalData.serviceCategoryIds === null ||
        personalData.serviceCategoryIds.length === 0
      ) {
        setSelectedSkills([]);
      }
      if (personalData.skill === null || personalData.skill === "") {
        setSuggestedSkillCats("");
      } else {
        setSuggestedSkillCats(personalData.skill);
      }
    }
  }, [personalData, skillCatOptions]);

  const skillCatsHandler = (_: any, cats: any) => {
    setSelectedSkills(cats);
  };

  const onSubmit = () => {
    const skillId =
      selectedSkills != null && selectedSkills?.length > 0
        ? selectedSkills.map((i) => i.id)
        : [];

    UpdateCreditCards(skillId, suggestedSkillCats);
  };

  return (
    <Paper className="profile-paper">
      <p className="profile-paper-title">مهارت ها</p>
      <Autocomplete
        value={selectedSkills}
        setValue={skillCatsHandler}
        options={skillCatOptions}
        label="مهارت های من"
        className="skills-multiselect"
      />
      <TextField
        label="سایر مهارت ها"
        shrink
        multiline
        fullWidth
        // rows={3}
        value={suggestedSkillCats}
        onTextChange={setSuggestedSkillCats}
        placeholder="اگر مهارتی دارید که در لیست بالا وجود ندارد در این قسمت بیان کنید"
      />
      <div className="profile-paper-btn-wrapper">
        <Button
          label="ذخیره"
          onClick={() => onSubmit()}
          size={matchesSm ? "sm" : "lg"}
          className="more-info-btn"
        />
      </div>
    </Paper>
  );
}

export default Skill;
