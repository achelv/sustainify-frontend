import { useState } from "react";

export const useActiveMenu = (defaultMenu = "dashboard") => {
  const [activeMenu, setActiveMenu] = useState(defaultMenu);

  const handleMenuChange = (menuId) => {
    setActiveMenu(menuId);
  };

  return { activeMenu, handleMenuChange };
};
