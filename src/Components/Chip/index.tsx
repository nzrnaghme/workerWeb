import Chip from "@material-ui/core/Chip";
import "./index.scss";

type Props = {
  label: string;
  onDelete: () => void;
};

function YChip({ label, onDelete }: Props) {
  return <Chip {...{ label, onDelete }} />;
}

export default YChip;
