export type Participant = {
  id: string;
  name: string;
  description: string;
};

export type Assignment = {
  gifter: Participant;
  receiver: Participant;
};

export interface RevealData {
    gifter: string;
    receiver: string;
    description: string;
    value: string;
}
