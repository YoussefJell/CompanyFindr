import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import Logout from "../components/Logout";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  const [searchInput, setSearchInput] = useState('');

  useEffect(async () => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    } else {
      setCurrentUser(
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )
      );
    }
  }, []);
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(async () => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        const filteredContacts = data.data.filter((contact) =>
          contact.username.toLowerCase().includes(searchInput.toLowerCase())
        );
        setContacts(filteredContacts);
      } else {
        navigate("/setAvatar");
      }
    }
  }, [currentUser, searchInput]);
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  const handleSearchInputChange = (e) => {
    // Step 4: Update search input value
    setSearchInput(e.target.value);
  };

  return (
    <>
      <Container>
        <div className="container">
          <input
            type="text" className="searchInput"
            placeholder="Search contacts"
            value={searchInput}
            onChange={handleSearchInputChange}
          />
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {currentChat === undefined ? (
            <div>
              <div className="chat-header-welcome">
                <Logout />
              </div>
              <Welcome />
            </div>
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #FFF5E0;
  .container {
    height: 100vh;
    width: 100vw;
    background-color: #FFF5E0;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
  .chat-header-welcome {
    display: flex;
    justify-content: flex-end;
    align-items: right;
    padding: 2rem 2rem;
    padding-bottom: 9rem;
  }
  input {
    position: absolute;
    background-color: #FFF5E0;
    padding: 1rem;
    border: 0.1rem solid #FF6969;
    border-radius: 0.4rem;
    color: black;
    width: 20%;
    left: 2.5%;
    bottom: 10%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #BB2525;
      outline: none;
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
      width: 30%;
    }
  }
`;
