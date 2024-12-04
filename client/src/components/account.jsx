import React, { useState, createContext, useEffect, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { TabMenu } from "primereact/tabmenu";
import { UserContext } from "../App";
import ErrorPage from "./error";
export const AccountIndexContext = createContext();
function Account(props) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRenderer = (item, itemIndex) => (
    <a
      className="p-menuitem-link flex align-items-center gap-2"
      onClick={() => {
        setActiveIndex(itemIndex);
        navigate(`/account/${item.name}`);
      }}
    >
      <span className="font-bold capitalize">{item.name}</span>
    </a>
  );

  const items = [
    {
      name: "orders",
      template: (item) => itemRenderer(item, 0),
    },
    {
      name: "addresses",
      template: (item) => itemRenderer(item, 1),
    },
    {
      name: "settings",
      template: (item) => itemRenderer(item, 2),
    },
  ];
  useEffect(() => {
    if (activeIndex === 1) navigate("./addresses");
    if (activeIndex === 2) navigate("./settings");
  }, [activeIndex]);
  return (
    <div>
      {user ? (
        <>
          <div className="card">
            <TabMenu
              model={items}
              activeIndex={activeIndex}
              onTabChange={(e) => setActiveIndex(e.index)}
              pt={{
                menu: {
                  className: "justify-content-center border-none py-2",
                },
              }}
            />
          </div>
          <AccountIndexContext.Provider value={{ setActiveIndex }}>
            <Outlet />
          </AccountIndexContext.Provider>
        </>
      ) : (
        <ErrorPage />
      )}
    </div>
  );
}

export default Account;
