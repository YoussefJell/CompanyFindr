import React, { useState, useEffect, useRef } from 'react';
import styled from "styled-components";
import { BiCollapseAlt } from "react-icons/bi";

export default function DraggableModal({ closeModal }) {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isVisible] = useState(true);
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnection = useRef(new RTCPeerConnection());

  useEffect(() => {
    // Access user media (camera and microphone)
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        peerConnection.current.addStream(stream);
      })
      .catch((error) => console.error('Error accessing media devices:', error));
  }, []);

  const handleMouseDown = (e) => {
    const isHeaderClicked = e.target.classList.contains('modal-header');

    if (isHeaderClicked) {
      setIsDragging(true);
      setOffset({
        x: e.clientX - e.target.getBoundingClientRect().left,
        y: e.clientY - e.target.getBoundingClientRect().top,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const modal = document.querySelector('.draggable-modal');
    const modalRect = modal.getBoundingClientRect();

    let left = e.clientX - offset.x;
    let top = e.clientY - offset.y;

    // Get the viewport dimensions
    const viewportWidth = window.innerWidth;
    const modalWidth = modalRect.width;

    // Check if the modal exceeds the right edge of the viewport
    if (left + modalWidth > viewportWidth) {
      left = viewportWidth - modalWidth;
    }

    modal.style.left = `${left}px`;
    modal.style.top = `${top}px`;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    isVisible && (<Container>
      <div
        className="draggable-modal"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div className="modal-header">
          {
            <div>
              <Button onClick={closeModal}>
                <BiCollapseAlt />
              </Button>
            </div>
          }
        </div>
        <div className="modal-content">
          {
            <>
              <div>
                <video ref={localVideoRef} autoPlay playsInline muted />
              </div>
              <div>
                <video ref={remoteVideoRef} autoPlay playsInline />
              </div>
            </>
          }
        </div>
      </div>
    </Container>)

  );
};

const Container = styled.div`
  .modal-header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 5px;
    height: 50px;
    cursor: grab;
    background-color: #FF6969;
    border-radius: 5px;

  }
  .modal-content {
    display: flex;
    padding-top: 8px;
    align-items: center;
    justify-content: space-around;
  }
  .draggable-modal {
    z-index: 99;
    position: absolute;
    width: 1350px;
    height: 550px;
    background-color: #FFF5E0;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #141E46;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #FFF5E0;
  }
`;