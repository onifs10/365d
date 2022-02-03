/* eslint-disable react/no-unescaped-entities */
import { NextPage } from "next";
import Head from "next/head";
import { useCallback, useEffect, useState, MouseEvent } from "react";
import { GoHome } from "../components/Layout";
import PaperTitle from "../components/PaperTitle";
import styles from "../styles/009.module.scss";

const BOX_SIZE = 400;
const Page009: NextPage = () => {
  const [dragging, setDragging] = useState<boolean>(false);
  const [box, setBox] = useState<HTMLDivElement | null>(null);
  const [innerBox, setInnerBox] = useState<HTMLDivElement | null>();
  const [startPosition, setStartPos] = useState<[number, number]>([0, 0]);
  const [postion, positionSet] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const updateBoxPosition = useCallback(
    (x: number, y: number) => {
      if (box) {
        box.style.top = y + "px";
        box.style.left = x + "px";
      }
    },
    [box]
  );
  const updateInnerBoxStyle = useCallback(
    (x: number, y: number) => {
      if (innerBox) {
        innerBox.style.width = window.innerWidth + "px";
        innerBox.style.height = window.innerHeight + "px";
        innerBox.style.top = -(y - window.screenTop) + "px";
        innerBox.style.left = -(x - window.screenLeft) + "px";
      }
    },
    [innerBox]
  );

  const handleMouseDown = (evt: MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    if (box) {
      box.style.cursor = "grabbing";
    }
    setStartPos([evt.screenX, evt.screenY]);
  };
  const handleMouseUp = useCallback(
    (evt: MouseEvent<HTMLDivElement>) => {
      if (dragging) {
        setDragging(false);
        let positionX = Math.min(
          Math.max(0, postion.x - (startPosition[0] - evt.screenX)),
          window.innerWidth - BOX_SIZE
        );
        let positionY = Math.min(
          Math.max(0, postion.y - (startPosition[1] - evt.screenY)),
          window.innerHeight - BOX_SIZE
        );
        positionSet({ x: positionX, y: positionY });
      }
      if (box) {
        box.style.cursor = "grab";
      }
    },
    [dragging, postion.x, postion.y, startPosition]
  );
  const onMouseMove = useCallback(
    (evt: MouseEvent<HTMLDivElement>) => {
      if (dragging) {
        let positionX = Math.min(
          Math.max(0, postion.x - (startPosition[0] - evt.screenX)),
          window.innerWidth - BOX_SIZE
        );
        let positionY = Math.min(
          Math.max(0, postion.y - (startPosition[1] - evt.screenY)),
          window.innerHeight - BOX_SIZE
        );
        updateBoxPosition(positionX, positionY);
        updateInnerBoxStyle(positionX, positionY);
      }
    },
    [dragging]
  );
  useEffect(() => {
    positionSet({
      x: (window.innerWidth - BOX_SIZE) / 2,
      y: (window.innerHeight - BOX_SIZE) / 2,
    });
    updateBoxPosition(
      (window.innerWidth - BOX_SIZE) / 2,
      (window.innerHeight - BOX_SIZE) / 2
    );
    updateInnerBoxStyle(
      (window.innerWidth - BOX_SIZE) / 2,
      (window.innerHeight - BOX_SIZE) / 2
    );
  }, [box, innerBox]);

  return (
    <div
      onMouseMove={onMouseMove}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
      }}
      onMouseUp={handleMouseUp}
    >
      <GoHome />
      <Head>
        <title> Scope </title>
        <meta name="description" content={"  view scope"} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.title}>
        <PaperTitle text={"Scope"} tips={"drag view box"} />
      </div>
      {/* {Props.children} */}
      <div ref={setBox} className={styles.box} onMouseDown={handleMouseDown}>
        <div className={styles.textBody} ref={setInnerBox}>
          <h3 className="font-bold mt-4 mb-2">
            The standard Lorem Ipsum passage, used since the 1500s
          </h3>
          <p>
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum."
          </p>
          <h3 className="font-bold mt-4 mb-2">
            Section 1.10.32 of "de Finibus Bonorum et Malorum", written by
            Cicero in 45 BC
          </h3>
          <p>
            "Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
            aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
            eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est,
            qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit,
            sed quia non numquam eius modi tempora incidunt ut labore et dolore
            magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis
            nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut
            aliquid ex ea commodi consequatur? Quis autem vel eum iure
            reprehenderit qui in ea voluptate velit esse quam nihil molestiae
            consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla
            pariatur?"
          </p>
          <h3 className="font-bold mt-4 mb-2">
            1914 translation by H. Rackham
          </h3>
          <p>
            "But I must explain to you how all this mistaken idea of denouncing
            pleasure and praising pain was born and I will give you a complete
            account of the system, and expound the actual teachings of the great
            explorer of the truth, the master-builder of human happiness. No one
            rejects, dislikes, or avoids pleasure itself, because it is
            pleasure, but because those who do not know how to pursue pleasure
            rationally encounter consequences that are extremely painful. Nor
            again is there anyone who loves or pursues or desires to obtain pain
            of itself, because it is pain, but because occasionally
            circumstances occur in which toil and pain can procure him some
            great pleasure. To take a trivial example, which of us ever
            undertakes laborious physical exercise, except to obtain some
            advantage from it? But who has any right to find fault with a man
            who chooses to enjoy a pleasure that has no annoying consequences,
            or one who avoids a pain that produces no resultant pleasure?"
          </p>
          <h3 className="font-bold mt-4 mb-2">
            Section 1.10.33 of "de Finibus Bonorum et Malorum", written by
            Cicero in 45 BC
          </h3>
          <p>
            "At vero eos et accusamus et iusto odio dignissimos ducimus qui
            blanditiis praesentium voluptatum deleniti atque corrupti quos
            dolores et quas molestias excepturi sint occaecati cupiditate non
            provident, similique sunt in culpa qui officia deserunt mollitia
            animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis
            est et expedita distinctio. Nam libero tempore, cum soluta nobis est
            eligendi optio cumque nihil impedit quo minus id quod maxime placeat
            facere possimus, omnis voluptas assumenda est, omnis dolor
            repellendus. Temporibus autem quibusdam et aut officiis debitis aut
            rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint
            et molestiae non recusandae. Itaque earum rerum hic tenetur a
            sapiente delectus, ut aut reiciendis voluptatibus maiores alias
            consequatur aut perferendis doloribus asperiores repellat."
          </p>
          <h3 className="font-bold mt-4 mb-2">
            1914 translation by H. Rackham
          </h3>
          <p>
            "On the other hand, we denounce with righteous indignation and
            dislike men who are so beguiled and demoralized by the charms of
            pleasure of the moment, so blinded by desire, that they cannot
            foresee the pain and trouble that are bound to ensue; and equal
            blame belongs to those who fail in their duty through weakness of
            will, which is the same as saying through shrinking from toil and
            pain. These cases are perfectly simple and easy to distinguish. In a
            free hour, when our power of choice is untrammelled and when nothing
            prevents our being able to do what we like best, every pleasure is
            to be welcomed and every pain avoided. But in certain circumstances
            and owing to the claims of duty or the obligations of business it
            will frequently occur that pleasures have to be repudiated and
            annoyances accepted. The wise man therefore always holds in these
            matters to this principle of selection: he rejects pleasures to
            secure other greater pleasures, or else he endures pains to avoid
            worse pains."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page009;
