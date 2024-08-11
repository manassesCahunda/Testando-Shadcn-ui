import React from 'react';

import { Avatars } from '@/components/Avatars';

import { AnimatedAgencyCarousel } from "@/components/ui/Animated";

const Profile = () => {
  
    return (
    
        <section className=" bg-black dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center mx-auto">
                <AnimatedAgencyCarousel />
                <div style={{marginTop:-40}} className="p-10  fixed bg-black  rounded-lg shadow  ">
                 <div className='flex flex-col w-full items-center justify-center'>
                    <Avatars />
                 </div>
                 <h2 className='py-3 px-4' >Manasses Binga</h2>
                </div>
            </div>
        </section>
    );
}

export default Profile;