import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef } from "react";
import { GoHome } from "./Layout";
import PaperTitle from "./PaperTitle";
import Styles from "../styles/paper.module.scss";
import runOnce from "../utils/once";
const Paper: React.FC<paperProps> = (Props): JSX.Element => {
  const paperDiv = useRef<HTMLDivElement>(null);
  const router = useRouter();

  //redirect back if user presses backspace
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleInteraction = useCallback(
    runOnce((event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Backspace") {
        router.back();
      }
    }),
    []
  );

  useEffect(() => {
    if (paperDiv.current) {
      paperDiv.current.focus();
    }
  }, [paperDiv]);

  return (
    <div
      onKeyDown={handleInteraction}
      onClick={handleInteraction}
      tabIndex={0}
      className={Styles.paper}
      ref={paperDiv}
    >
      <GoHome />
      <Head>
        <title>{Props.pageTitle}</title>
        <meta
          name="description"
          content={Props.pageDescription || "Exploring js"}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PaperTitle text={Props.paperTitle} tips={Props.paperTip} />
      {Props.children}
    </div>
  );
};

export default Paper;

interface paperProps {
  pageTitle: string;
  pageDescription: string;
  paperTitle: string;
  paperTip: string | JSX.Element;
}
