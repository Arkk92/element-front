<template>
  <div class="chat-layout">
    <div>
      Chat
    </div>
    <div class="messages">
      <div class="message small p-2 mb-1 rounded-3 ms-3" v-for="message in messages" :key="message" v-bind:class="{ 'ownerMessage me-3 bg-primary text-white': isOwnerMessage(message) }">
        <p style="margin: 0">
        {{message}}
        </p>
      </div>
    </div>
    <div class="writtingBoxDiv">
      <input type="text" v-on:keyup.enter="onEnter" v-model="inputText" class="form-control" aria-label="message…" placeholder="Write message…">

      <button type="button" class="btn btn-outline-dark" v-on:click="sendMessage"><i class="bi bi-send" aria-hidden="true"></i></button>
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import { SocketInstance } from '@/main';
import { ChatServerToClient, ChatClientToServer } from '@/sockets/socketUtils';


export default defineComponent({
  name: 'ChatLayout',
  components: {
    
  },
  props: {
    roomId: String,
  },
  data() {
    let messages: string[] = [];
    return {
      messages,
      inputText: ''
    }
  },
  mounted() {
    SocketInstance.on("chat", (data: ChatServerToClient) => {
      
      if (this.messages) {
        this.messages.push(data.message as string)
      } else {
        this.messages = [data.message as string]
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

    isOwnerMessage(message) {
      if(message.includes(SocketInstance.id.slice(0,5))) return true;
      return false;
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chat-layout {
  display: flex;
  flex-direction: column;


}
.message {
  display: flex;
  justify-content: left;
  border-radius: 7%;
  align-items: flex-start;
  background-color: #e5e5ea;
  color: #000;
  display: inline-block;
  min-width: 50%;
  max-width: 50%;
  padding: 2px;
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
  justify-content: right;
  align-self: flex-end;
  background-color: #248bf5;
  color: #fff;  
  margin: 0.25rem 0 0;
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
  transform:translate(-30px, -2px);
  width: 10px;
}
.messages {
  height: 70vh;;
  border: solid 1px #bdbbbb;
  border-radius: 2%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column
}

.form-control {
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: #222;
  background-color: #fff;
  background-clip: padding-box;
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

.writtingBoxDiv {
  display: flex;
}
</style>
