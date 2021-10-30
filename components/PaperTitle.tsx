import Styles from "../styles/title.module.scss";
import { Classes, Tooltip2 } from "@blueprintjs/popover2";
const PaperTitle = (Props: PaperTitleProps): JSX.Element => {
  return (
    <div className={`${Styles.title} ${Props.className}`}>
      <div className={Styles.text}>{Props.text}</div>
      <Tooltip2
        className={`${Classes.TOOLTIP2_INDICATOR} ${Styles.question}`}
        content={<span className={Styles.tip}>{Props.tips}</span>}
        intent="success"
        minimal={true}
      >
        ?
      </Tooltip2>
    </div>
  );
};

export default PaperTitle;

interface PaperTitleProps {
  tips?: string | JSX.Element;
  text: string;
  [x: string]: any;
}
