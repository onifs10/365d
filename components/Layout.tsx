import Link from "next/link";
import { Icon } from "@blueprintjs/core";

import Styles from "../styles/layout.module.scss";

const Layout: React.FC = ({ children }) => {
  return <div className={Styles.container}>{children}</div>;
};

export const GoHome: React.FC = () => {
  return (
    <div className={Styles.nav} tabIndex={0} title="go Home">
      <Link href="/" passHref>
        <Icon icon="step-backward" size={40} />
      </Link>
    </div>
  );
};

export default Layout;
