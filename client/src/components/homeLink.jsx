import { Link } from "react-router-dom";

const home = () => {
  return (
    <Link to="/">
      <p className="text-primary underline">Home</p>
    </Link>
  );
};

const HomeLink = { icon: "pi pi-home", template: home };
export default HomeLink;
