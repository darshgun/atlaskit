export type CreateProps = {
  text: string;
  buttonTooltip?: React.ReactNode;
  iconButtonTooltip?: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
};
