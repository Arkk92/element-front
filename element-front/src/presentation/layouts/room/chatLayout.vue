<template>
  <div class="chat-layout">
    <div class="backdrop"></div>
    <div class="messages">
      <div class="message small ms-3" v-for="message in messages" :key="message"
        v-bind:class="{ 'ownerMessage bg-primary text-white': isOwnerMessage(message) }">
        <p>
          {{ message.user.name }} : {{ message.message }}
        </p>
      </div>
    </div>
    <div class="writtingBoxDiv">
      <input type="text" v-on:keyup.enter="onEnter" v-model="inputText" class="form-control" aria-label="message…"
        placeholder="Write message…">

      <button type="button" class="btn btn-light btn-placement" v-on:click="sendMessage"><i
          class="bi bi-send icon-button" aria-hidden="true"></i></button>
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import { SocketInstance } from '@/main';
import { ChatServerToClient, ChatClientToServer } from '@/infra/sockets/socketUtils';
import { UserModel } from '@/domain/game/models/user';

type MessageType = {
  user: UserModel
  message: string
}

export default defineComponent({
  name: 'ChatLayout',
  components: {

  },
  props: {
    roomId: String,
  },
  data() {
    let messages: MessageType[] = [];
    return {
      messages,
      inputText: ''
    }
  },
  mounted() {
    SocketInstance.on("chat", (data: ChatServerToClient) => {
      if (this.messages) {
        this.messages.push({ user: data.user, message: data.message })
      } else {
        this.messages = [{ user: data.user, message: data.message }]
      }

    })
  },
  methods: {
    onEnter() {
      this.sendMessage();
    },
    sendMessage() {
      let message: ChatClientToServer = {
        roomId: this.roomId!,
        message: this.inputText
      }
      SocketInstance.emit("chat", message);
      this.inputText = '';
    },

    isOwnerMessage(message: MessageType) {
      if (message.user.socket_id == SocketInstance.id) return true;
      return false;
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chat-layout {
  position: relative;
  display: block;
  overflow: hidden;
  padding-top: 5%;
  padding-bottom: 5%;
  padding-left: 2%;
  padding-right: 2%;
  height: 100%;

}

.message {
  position: relative;
  border-radius: 7%;
  background-color: #e5e5ea;
  text-align: end;
  color: #000;
  display: inline-block;
  min-width: fit-content;
  max-width: 75%;
  padding: 2px;
  margin-top: 2px;
  margin-left: 50% !important;
}

.message:before {
  border-bottom-right-radius: 0.8rem 0.7rem;
  border-left: 1rem solid #e5e5ea;
  left: -0.35rem;
  transform: translate(0, -0.1rem);
}

.message::after {
  background-color: #fff;
  border-bottom-right-radius: 0.5rem;
  left: 20px;
  transform: translate(-30px, -2px);
  width: 10px;
}

.ownerMessage {
  text-align: start !important;
  justify-content: left;
  display: inline-block;
  margin: 0.25rem 0 0;
  margin-left: 0% !important;
}

.ownerMessage::before {
  border-bottom-left-radius: 0.8rem 0.7rem;
  border-right: 1rem solid #248bf5;
  right: -0.35rem;
  transform: translate(0, -0.1rem);
}

.ownerMessage::after {
  background-color: #fff;
  border-bottom-left-radius: 0.5rem;
  right: -40px;
  transform: translate(-30px, -2px);
  width: 10px;
}

.messages {
  position: relative;
  height: 95%;
  border: solid 1px #bdbbbb;
  border-radius: 2%;
  overflow-y: scroll;
  display: block;
  padding: 2px;
  z-index: 3;
}

.backdrop {
  position: absolute;
  height: 100%;
  left: 0;
  right: 0;
  top: 1%;
  bottom: 1%;
  background: black;
  opacity: 0.5;
  z-index: 2;
}

.writtingBoxDiv {
  position: relative;
  bottom: 1%;
  height: 7%;
  width: 100%;
  z-index: 3;
}

.form-control {
  position: absolute;
  display: block;
  width: 74%;
  height: 100%;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  color: black;
  background-clip: padding-box;
  background-color: white;
  border: 1px solid #ccc;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  outline: 0;
  box-shadow: inherit;
}

.chat-layout {
  height: 100%;
}

.btn-placement {
  position: absolute;
  width: 25%;
  height: 100%;
  top: 0;
  right: 0;
}

p {
  word-break: break-all;
  white-space: normal;
  margin: 0;
}

.icon-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@media screen and (max-width: 785px) , screen and (max-height: 400px) {
  .form-control {
    position: absolute;
    display: block;
    width: 74%;
    height: 100%;
    font-size: 0.875rem !important;
    font-weight: 400;
    line-height: 1.5;
    color: black;
    background-clip: padding-box;
    background-color: white;
    border: 1px solid #ccc;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }

  .message {
    display: flex;
    justify-content: left;
    border-radius: 7%;
    align-items: flex-start;
    background-color: #e5e5ea;
    color: #000;
    display: inline-block;
    min-width: 100%;
    max-width: 50%;
    padding: 2px;
  }

  .small {
    font-size: 0.75rem !important;
  }

  .ms-3 {
    margin-left: 0rem !important;
  }
}
</style>
