import React, { useEffect, useState, FC } from "react";
import { Button, Form, Input, Row, Col, Card } from "antd";
import io from "socket.io-client";
import "./App.less";
import * as uuid from "uuid";

interface Message {
  id: string;
  name: string;
  text: string;
}
interface Payload {
  name: string;
  text: string;
}

const socket = io("http://localhost:3001", { transports: ["websocket", "polling", "flashsocket"] });

const App: FC = () => {
  const [form] = Form.useForm();
  const [name, setName] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    socket.on("msgToClient", (message: Payload) => {
      receivedMessage(message);
    });
  }, [messages, name]);

  const receivedMessage = ({ name, text }: Payload) => {
    const newMessage: Message = {
      id: uuid.v4(),
      name,
      text,
    };
    setMessages([...messages, newMessage]);
  };
  const handleChangeInputName = () => {
    const _name = form.getFieldValue("name");
    setName(_name);
  };

  const onFinish = (values: any) => {
    socket.emit("msgToServer", values);
    form.setFieldsValue("text");
  };
  return (
    <div>
      <Row justify="center" align="middle" style={{ height: "100vh" }}>
        <Col xs={12}>
          <Card>
            <Form form={form} onFinish={onFinish}>
              <Form.Item name="name">
                <Input placeholder="Enter Name..." onChange={handleChangeInputName} />
              </Form.Item>
              <div style={{ height: "50vh" }}>
                {messages.map((message) => {
                  if (message.name === name) {
                    return (
                      <Row justify="start">
                        <div>
                          <p>Name : {message.name}</p>
                          <p>Message : {message.text}</p>
                        </div>
                      </Row>
                    );
                  }
                  return (
                    <Row justify="end">
                      <div>
                        <p>Name : {message.name}</p>
                        <p>Message : {message.text}</p>
                      </div>
                    </Row>
                  );
                })}
              </div>
              <Form.Item name="text">
                <Input.TextArea placeholder="Enter message..." />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" type="primary">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default App;
