import Styles from "../styles/layout.module.scss";

const Layout: React.FC = ({ children }) => {
  return <div className={Styles.container}>{children}</div>;
};

export default Layout;
