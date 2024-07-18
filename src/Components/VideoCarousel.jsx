import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/dist/ScrollTrigger.js";
import React, { useEffect, useRef, useState } from 'react'
import { hightlightsSlides } from '../constants'
import { pauseImg, playImg, replayImg } from '../utils';

gsap.registerPlugin(ScrollTrigger);

const VideoCarousel = () => {
  const videoRef = useRef([]);
  const videoDivRef = useRef([]);
  const videoSpanRef = useRef([]);

  const [video,setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId:0,
    isLastVideo: false,
    isPlaying:false
  })

  const {isEnd,isPlaying,startPlay, videoId, isLastVideo} = video;

  const [loadedData , setLoadedData] = useState([]);

  useGSAP(()=>{

    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut", 
    });

    gsap.to('#video',{
      scrollTrigger:{
        trigger:'#video',
        toggleActions:'restart none none none'
      },
      onComplete: ()=>{
        setVideo((prev)=>({
         ...prev,
         isPlaying:true,
         startPlay:true,
        }))
      }
    })
  },[isEnd,videoId])

  useEffect(()=>{
    if(loadedData.length>3){
      if(!isPlaying){
        videoRef.current[videoId].pause();
      }
      else{
        // console.log(startPlay);
        startPlay && videoRef.current[videoId].play();
      }
    }

  },[startPlay,videoId,isPlaying,loadedData])

  const handleLoadedData = (i,e)=>setLoadedData((prev)=>[...prev,e])

  useEffect(()=>{
    let currentProgress = 0;
    let span = videoSpanRef.current;

    if(span[videoId]){
      let animation = gsap.to(span[videoId] , {
        onUpdate:()=>{
          const progress = Math.ceil(animation.progress()*100);

          if(progress !== currentProgress){
            currentProgress = progress;
            gsap.to(videoDivRef.current[videoId],{
              width: window.innerWidth <760 
              ? "10vw" : window.innerWidth < 1200
              ? "10vw" : "4vw",
              
            })
  
            gsap.to(span[videoId],{
              width: `${currentProgress}%`,
              backgroundColor: "white",
             
            })
          }

        },
        onComplete:()=>{
          if(isPlaying){
            gsap.to(videoDivRef.current[videoId],{
              width:'12px'
            })
            gsap.to(span[videoId],{
              backgroundColor: "#afafaf"
            })
          }
        }
      })
      if(videoId === 0){
        animation.restart();
      }

      const animUpdate = ()=>{
        animation.progress(videoRef.current[videoId].currentTime/hightlightsSlides[videoId].videoDuration)
      }
      if(isPlaying){
        gsap.ticker.add(animUpdate);
      }
      else{
        gsap.ticker.remove(animUpdate);
      }
    }


  },[startPlay, videoId])

  const handlePlay = (type, i) => {
    switch (type) {
      case "video-end":
        setVideo((pre) => ({ ...pre, isEnd: true, videoId: i + 1 }));
        break;

      case "video-last":
        setVideo((pre) => ({ ...pre, isLastVideo: true }));
        break;

      case "video-reset":
        setVideo((pre) => ({ ...pre, videoId: 0, isLastVideo: false }));
        break;

      case "pause":
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;

      case "play":
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;

      default:
        return video;
    }
  };

  return (
    <>
    <div className='flex items-center'>
      {hightlightsSlides.map((list,i)=>(
        <div key={list.id} id = "slider" className='sm:pr-20  pr-10'>
          <div className='video-carousel_container'>
            <div className='h-full w-full rounded-3xl overflow-hidden bg-black'>
              <video id='video' className='w-full h-full object-cover'  playsInline={true} preload='auto' muted src={list.video} type="video/mp4" ref={(ref)=>(videoRef.current[i] = ref)}
              onPlay={()=>{
                setVideo((prev)=>({
                  ...prev,isPlaying:true
                }))
              }}

              onEnded = {()=>
               i !==3
              ? handlePlay("video-end",i)
              : handlePlay("video-last")
            }

              onLoadedMetadata = {(e)=>{
                handleLoadedData(i,e)
              }}
              ></video>
            </div>
            <div className='absolute top-12 left-[5%] z-10'>
              {list.textLists.map((text, index)=>(
                <p  key = {index} className='md:text-2xl text-xl font-medium'>{text}</p>
              ))}
            </div>
          </div>

        </div>
      ))}
    </div>
    <div className='relative mt-8 flex-center '>
        <div className='flex-center px-7 py-5 bg-gray-300 backdrop-blur rounded-full'>
          {videoRef.current.map((_,i) => (
            <span
            key={i}
            ref={(ref)=>(videoDivRef.current[i]=ref)}
            className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
            >
              <span
                className='absolute h-full w-full rounded-full '
                ref={(ref) =>(videoSpanRef.current[i]=ref)}
              />

            </span>
          ))}
        </div>
        <button type='button' className='control-btn'>
          <img 
          src= {isLastVideo? replayImg : isPlaying? pauseImg:playImg }
          alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
          onClick = {
            isLastVideo? () => handlePlay("video-reset"):
            isPlaying? () => handlePlay("pause"):
            ()=>handlePlay("play")
          }
          />
        </button>
    </div>
    </>
  )
}

export default VideoCarousel;