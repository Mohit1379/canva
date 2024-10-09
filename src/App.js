import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Konva from 'konva';

const App = () => {
  const [inputText, setInputText] = useState('');
  const [fontSize] = useState(40);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textNode, setTextNode] = useState(null); // Track the text node
  const [images, setImages] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const layerRef = useRef();
  const videoRef = useRef();

  useEffect(() => {
    const stage = new window.Konva.Stage({
      container: 'container',
      width: window.innerWidth,
      height: window.innerHeight,
    });

    layerRef.current = new window.Konva.Layer();
    stage.add(layerRef.current);

    return () => {
      layerRef.current.destroy();
    };
  }, []);

  const addText = () => {
    if (textNode) {
      // Remove existing text if it already exists
      textNode.destroy();
      setTextNode(null);
      layerRef.current.draw();
      return; // Stop execution if we're removing text
    }

    const newTextNode = new window.Konva.Text({
      text: inputText,
      fontSize: fontSize,
      fontFamily: fontFamily,
      x: 100,
      y: 100,
      draggable: true,
    });

    newTextNode.on('click', () => {
      setTextNode(newTextNode);
    });

    newTextNode.on('dragend', (e) => {
      const newPos = e.target.position();
      console.log(`Text moved to: ${newPos.x}, ${newPos.y}`);
    });

    layerRef.current.add(newTextNode);
    layerRef.current.draw();
    setTextNode(newTextNode); // Track the newly created text
    setInputText(''); // Clear input after adding text
  };

  const handleFontFamilyChange = (event) => {
    setFontFamily(event.target.value);
    if (textNode) {
      textNode.fontFamily(event.target.value);
      layerRef.current.draw();
    }
  };

  const addImage = (src) => {
    const imageObj = new window.Image();
    imageObj.src = src;

    imageObj.onload = () => {
      const imageNode = new window.Konva.Image({
        x: 150,
        y: 50,
        image: imageObj,
        draggable: true,
      });

      imageNode.on('click', () => {
        setTextNode(imageNode);
      });

      imageNode.on('dragend', (e) => {
        const newPos = e.target.position();
        console.log(`Image moved to: ${newPos.x}, ${newPos.y}`);
      });

      layerRef.current.add(imageNode);
      layerRef.current.draw();
      setImages((prev) => [...prev, imageNode]);
    };
  };

  const removeImage = () => {
    if (images.length > 0) {
      const lastImage = images.pop();
      lastImage.destroy();
      setImages([...images]);
      layerRef.current.draw();
    }
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const toggleVideo = () => {
    if (!videoUrl) {
      setVideoUrl('https://www.w3schools.com/html/mov_bbb.mp4');
      setIsVideoPlaying(true);
    } else {
      const videoElement = videoRef.current;
      if (isVideoPlaying) {
        videoElement.pause();
        setIsVideoPlaying(false);
      } else {
        videoElement.play();
        setIsVideoPlaying(true);
      }
    }
  };

  const stopVideo = () => {
    setVideoUrl('');
    setIsVideoPlaying(false);
  };

  return (
    <div className="App">
      <div className='d-flex flex-wrap mt-5'>
        <div className='col-6 d-flex flex-column align-items-center'>
          <h2>Start Editing from here</h2>
          <div className='mt-5'>
            <h4>Insert text</h4>
            <input type='text' value={inputText} onChange={handleInputChange} />
            <button type="button" className="btn btn-primary" onClick={addText}>
              {textNode ? 'Remove Text' : 'Add Text'}
            </button>
          </div>
          <div className='mt-3 d-flex'>
            <h4 className='me-3'>Add Font Style</h4>
            <select value={fontFamily} onChange={handleFontFamilyChange}>
              <option value="Arial">Arial</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Verdana">Verdana</option>
            </select>
          </div>
          <div className='mt-5'>
            <h4>Add Image</h4>
            <button type="button" className="btn btn-primary mt-4" onClick={() => addImage('https://konvajs.org/assets/yoda.jpg')}>Add Image</button>
            <button type="button" className="btn btn-danger mt-4 ms-4" onClick={removeImage}>Remove Image</button>
          </div>
          <div className='mt-5'>
            <h4>Add Video</h4>
            <button type="button" className="btn btn-primary" onClick={toggleVideo}>
              {videoUrl ? (isVideoPlaying ? 'Pause Video' : 'Play Video') : 'Add Video'}
            </button>
            <button type="button" className="btn btn-danger ms-4" onClick={stopVideo}>Stop Video</button>
          </div>
        </div>
        <div className='col-6 p-5'>
          <div id="container" className='viewportArea border' style={{ position: 'relative', width: '600px', height: '600px', overflow: 'hidden' }}>
            {videoUrl && (
              <video
                ref={videoRef}
                src={videoUrl}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: -1,
                  display:'block'
                }}
                autoPlay={isVideoPlaying}
                loop
                muted
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
