import { useState, useEffect, KeyboardEvent, useRef } from "react";
import React from "react";
import { IconButton, LinearProgress, Tooltip } from "@mui/material";
import hljs from "highlight.js";
import { Renderer, marked } from "marked";
import htmlBeautify from "html-beautify";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

type AIAnswer = {
  answer: string | null,
  source_documents: string[] | null
}

type Question = {
  question: string
}

type Message = AIAnswer & Question

const parser = (text: string) => {
  let renderer = new Renderer();
  renderer.paragraph = (text) => {
    return text.replace(/(?:\r\n|\r|\n)/g, "<br>") + "\n";
  };
  renderer.list = (text) => {
    return `${text.replace(/(?:\r\n|\r|\n)/g, "<br>")}\n\n`;
  };
  renderer.listitem = (text) => {
    return `\n• ${text.replace(/(?:\r\n|\r|\n)/g, "<br>")}`;
  };
  renderer.code = (code, language) => {
    const validLanguage = hljs.getLanguage(language || "")
      ? language
      : "plaintext";
    const highlightedCode = hljs.highlight(
      validLanguage || "plaintext",
      code
    ).value;
    return `<pre class="highlight bg-gray-700" style="padding: 5px; border-radius: 5px; overflow: auto; overflow-wrap: anywhere; white-space: pre-wrap; max-width: 100%; display: block; line-height: 1.2"><code class="${language}" style="color: #d6e2ef; font-size: 12px; ">${highlightedCode}</code></pre>`;
  };
  marked.setOptions({ renderer });
  return marked(text);
}

const ChatGPTResponseFormatter = (response: string) => {
  const parsedResponse = parser(response);
  const beautifiedResponse = htmlBeautify(parsedResponse);

  return (
    <div dangerouslySetInnerHTML={{ __html: parsedResponse }} />
  );
};

function App() {
  const [prompt, updatePrompt] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([])
  const inputRef = useRef(null);
  const currentQuesRef = useRef(null);

  useEffect(() => {
    // Auto-focus the input element when the component mounts
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    // if answer in last message is not null, set inputRef in focus
    if (messages.length && messages[messages.length - 1]?.answer && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages]);

  const handleKeySubmit = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }
    await handleSubmit();
  }

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const chatHistory = messages.map(m => [m.question, m.answer]);
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: prompt, chat_history: chatHistory}),
      };

      setMessages([...messages, { question: prompt, answer: null, source_documents: null }])
      updatePrompt("")

      const res = await fetch("https://127.0.0.1:5000/chat", requestOptions);

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      const message = await res.json();
      console.log("message", message);
      // update the answer and source documents in last message
      setMessages(messages => {
        const newMessages = [...messages];
        newMessages[messages.length - 1].answer = message?.answer;
        newMessages[messages.length - 1].source_documents = message?.source_documents;
        return newMessages;
      })

    } catch (err) {
      console.error(err, "err");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col rounded-lg mx-auto w-screen bg-white h-screen">
      <div className="flex items-center justify-start w-full text-black bg-[#f1f3f5] border-b-[1px] border-b-[#ced4da] tracking-tighter p-6">
        <img className="w-10 h-10 mr-4 rounded-full" src="./logo.png" alt="logo" />
        <div className="text-xl font-black">Tron Assistant</div>
      </div>
      <div className="h-full overflow-y-scroll flex flex-col text-base items-center px-8 pt-4 pb-20">
        {
          messages && messages.map((msg, i) => {
            return <div key={i} className="flex flex-col w-full justify-start py-2">
              <div className="font-black py-2">{msg.question}</div>
              {
                msg.answer ?
                  <>
                    <div className="py-2 text-gray-500">
                      {ChatGPTResponseFormatter(msg.answer)}
                    </div>
                    {msg.source_documents &&
                      <div className="flex items-center gap-2 my-3 text-sm">
                        <div className="font-black">Read More:</div>
                        {
                          msg.source_documents.map((s, ii) => {
                
                            return <Tooltip key={"source-doc-" + i.toString() + ii.toString()} title={s}><a
                              href={s}
                              target="_blank"
                              className="px-2 py-1 hover:underline cursor-pointer no-underline text-black bg-gray-50 border-[1px] border-gray-200 rounded hover:bg-gray-100 hover:border-gray-400"
                            >
                              {s.split('/')[s.split('/').length - 1]}
                            </a></Tooltip>
                          })
                        }
                        <div className="self-end">
                          <IconButton
                            onClick={() => {
                              navigator.clipboard.writeText(msg.answer);
                            }}
                          >
                            <ContentCopyIcon fontSize="small"/>
                          </IconButton>
                        </div>
                      </div>
                    }
                  </>
                  : <div className="py-2 mb-4" ref={i == messages.length - 1 ? currentQuesRef : null}>
                    <p className="text-sm my-2 text-gray-400">Gathering sources</p>
                    <LinearProgress color="error" />
                  </div>
              }
              {/* {msg.answer &&  */}
              {/* add a copy answer icon button in right bottom corner and a bottom border to end the q/a */}

            </div>
          })
        }
        <div className="w-full fixed bottom-0 px-8 bg-white">
        <input
          type="text"
          ref={inputRef}
          className="block w-[100%] my-2 mb-6 border-[1px] rounded-lg outline-none text-base text-black p-3 bg-white bg-left-center bg-no-repeat bg-3.5% focus:border-[1px] focus:border-[#dc062b]"
          placeholder="Ask me anything about Tron Chain"
          disabled={loading}
          value={prompt}
          onChange={(e) => updatePrompt(e.target.value)}
          onKeyDown={(e) => handleKeySubmit(e)}
        />
        </div>
        <div>
        </div>
      </div>
    </div>
  );
}

export default App;
