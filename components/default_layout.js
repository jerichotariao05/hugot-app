import LeftMenu from "./left_menu";
import RightMenu from "./right_menu";

const DefaultLayout = ({ children }) => {
  return (
    <>
      <div className="flex gap-6">
        <div className="hidden xl:block w-[25%]">
          <LeftMenu />
        </div>
        <div className="w-full lg:w-[45%]">
          <div className="flex flex-col gap-4">
            {children}
            </div>
        </div>
        <div className="hidden xl:block w-[30%]">
          <RightMenu />
        </div>
      </div>
    </>
  );
};

export default DefaultLayout;
