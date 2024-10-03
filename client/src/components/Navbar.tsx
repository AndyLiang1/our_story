export interface INavBarProps {
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export function NavBar({setShowForm}: INavBarProps) {
    return <div className="h-[10%] w-full bg-white flex justify-start ">
        <div className="h-full w-[20%] bg-red-200 text-[3rem]">Our Story</div>
        <div className="h-full w-[10%] text-[1.2rem] flex justify-center items-center text-center cursor-pointer">Stories</div>
        <div className="h-full w-[10%] text-[1.2rem] flex justify-center items-center text-center cursor-pointer" onClick = {() => {setShowForm(true)}}>Create</div>
    </div>;
}
