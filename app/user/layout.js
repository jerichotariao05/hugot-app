import Navbar from "@/components/navbar";

const UserLayout = ({ children }) => {
  return (
    <>
      <div className="fixed top-0 w-full z-100 drop-shadow-sm ">
        <Navbar />
      </div>

      {/* Content area */}
      <div className="bg-slate-50 min-h-screen px-4 md:px-2 lg:px-4 xl:px-8" style={{marginTop: "67px"}}>
        {children}
      </div>
    </>
  );
};

export default UserLayout;
