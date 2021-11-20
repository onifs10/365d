import { Slider } from "@blueprintjs/core";
import { FC } from "react";
import styles from "../styles/slider.module.scss";

export interface SliderComponentProps {
  min: number;
  max: number;
  stepSize: number;
  labelStepSize: number;
  onChange: (n: number) => void;
  value: number;
  vertical?: boolean;
}

const SliderComponent: FC<SliderComponentProps> = (Props): JSX.Element => {
  return (
    <div className={styles.sliderWrapper}>
      <Slider
        min={Props.min}
        max={Props.max}
        stepSize={Props.stepSize}
        value={Props.value}
        onChange={Props.onChange}
        labelStepSize={Props.labelStepSize}
        vertical={Props.vertical}
        intent={"success"}
      />
    </div>
  );
};

export default SliderComponent;
