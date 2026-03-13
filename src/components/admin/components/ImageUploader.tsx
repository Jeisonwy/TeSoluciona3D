export default function ImageUploader({ onChange }) {
  return (
    <input
      type="file"
      accept="image/*"
      onChange={(e) => onChange(e.target.files[0])}
    />
  );
}
