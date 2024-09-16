import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link, useParams } from 'react-router-dom';
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  const [activeTab, setActiveTab] = useState('posts');
  const { userProfile, user } = useSelector((store) => store.auth);

  
  useGetUserProfile(userId);

  
  const isLoggedUserProfile = user?._id === userProfile?._id;
  const isFollowing = false; 

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

 
  const displayedPost = activeTab === 'posts' ? userProfile?.posts || [] : userProfile?.bookmarks || [];

  return (
    <div className='flex max-w-5xl justify-center mx-auto pl-10'>
      <div className='flex flex-col gap-20 p-8'>
        <div className='grid grid-cols-2'>
          <section className='flex items-center justify-center'>
            <Avatar className="h-32 w-32">
              <AvatarImage src={userProfile?.profilePicture} alt="profilePicture" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className='flex flex-col gap-5'>
              <div className='flex items-center gap-2'>
                <span>{userProfile?.username}</span>
                {isLoggedUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button variant="secondary" className="hover:bg-gray-200 h-8 rounded">Edit Profile</Button>
                    </Link>
                    <Button variant="secondary" className="hover:bg-gray-200 h-8 rounded">View Archives</Button>
                    <Button variant="secondary" className="hover:bg-gray-200 h-8 rounded">Ad Tools</Button>
                  </>
                ) : (
                  isFollowing ? (
                    <>
                      <Button variant="secondary" className="bg-gray-300 rounded hover:bg-gray-400 h-8 text-black">Unfollow</Button>
                      <Button variant="secondary" className="bg-gray-300 rounded hover:bg-gray-400 h-8 text-black">Message</Button>
                    </>
                  ) : (
                    <Button className="bg-[#0095F6] rounded hover:bg-[#0775bf] h-8">Follow</Button>
                  )
                )}
              </div>
              <div className='flex items-center gap-4'>
                <p><span className='font-semibold'>{userProfile?.posts?.length || 0}</span> posts</p>
                <p><span className='font-semibold'>{userProfile?.followers?.length || 0}</span> followers</p>
                <p><span className='font-semibold'>{userProfile?.following?.length || 0}</span> following</p>
              </div>
              <div className='flex flex-col'>
                <span>{userProfile?.bio || "bio here..."}</span>
                <Badge className="w-fit" variant="secondary">
                  <AtSign /><span className='pl-1'>{userProfile?.username}</span>
                </Badge>
              </div>
            </div>
          </section>
        </div>
        <div className='border-t border-t-gray-200'>
          <div className='flex items-center justify-center gap-10 text-sm'>
            <span
              className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold' : ""}`}
              onClick={() => handleTabChange('posts')}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold' : ""}`}
              onClick={() => handleTabChange('saved')}
            >
              SAVED
            </span>
            <span className='py-3 cursor-pointer'>REELS</span>
            <span className='py-3 cursor-pointer'>TAGS</span>
          </div>
          <div className='grid grid-cols-3 gap-1'>
            {displayedPost.map((post) => (
              <div key={post?._id} className='relative group cursor-pointer'>
                <img src={post.image} alt="postimage" className='rounded-sm w-full object-cover aspect-square' />
                <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 opacity-0 group-hover:bg-opacity-50 group-hover:opacity-100 transition-all duration-300'>
                  <div className='flex items-center text-white space-x-4'>
                    <button className="flex items-center gap-2 hover:text-gray-300 transition-colors duration-200">
                      <Heart />
                      <span>{post?.likes?.length || 0}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-gray-300 transition-colors duration-200">
                      <MessageCircle />
                      <span>{post?.comments?.length || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
