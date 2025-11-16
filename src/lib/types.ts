export type Participant = {
  id: string;
  name: string;
  description: string;
};

export type Assignment = {
  gifter: Participant;
  receiver: Participant;
};
