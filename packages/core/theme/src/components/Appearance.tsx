interface Props {
  children: Function;
  props: {} | string;
  theme: {};
}

// TODO: no idea what this is for, or where it is used
export default function Appearance({ children, props, theme }: Props) {
  const appearance = typeof props === 'object' ? 'default' : props;
  const merged = typeof props === 'object' ? { ...props } : {};
  Object.keys(theme).forEach(key => {
    if (!(key in merged)) {
      merged[key] = theme[key]({ appearance });
    }
  });
  return children(merged);
}
