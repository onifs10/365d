import Styles from "../styles/title.module.scss";
import { Classes, Tooltip2 } from "@blueprintjs/popover2";
const Title = (Props: TitleProps): JSX.Element => {
  return (
    <div className={`${Styles.title} ${Props.className}`}>
      {Props.text}
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

export default Title;

interface TitleProps {
  tips?: string;
  text: string;
  [x: string]: any;
}
