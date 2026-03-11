import { getAvatarColor, getInitials } from "./constants";

export default function Avatar({ name, size = 44 }) {
  const [backgroundColor, textColor] = getAvatarColor(name);

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: backgroundColor,
      color: textColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Nunito', sans-serif",
      fontWeight: 800,
      fontSize: size * 0.3,
      flexShrink: 0,
    }}>
      {getInitials(name)}
    </div>
  );
}
