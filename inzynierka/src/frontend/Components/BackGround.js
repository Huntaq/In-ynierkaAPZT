
import Notifications from './NotificationsModal';
import Sidebar from './Sidebar';


export default function BackGround({children}){
    return (
        <div className='w-full h-full min-h-screen bg-[#6E9B7B] content-center'>
            <div className='flex w-full max-w-[1440px] max-h-[800px] h-[800px]  h-full justify-self-center gap-[10px] p-[10px]'>
                <div className='w-[20%] max-w-[120px]  rounded-[10px] bg-[#D9EDDF] justify-items-center max-h-[760px]'>
                    <Sidebar />
                </div>
                <>
                {children}
                </>
                <Notifications />
            </div>
        </div>
    );
}