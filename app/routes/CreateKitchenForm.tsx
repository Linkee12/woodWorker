export type KitchenType = "|" | "L" | "U";

export type KitchenFormValues = {
  width: number;
  length: number;
  height: number;
  type: KitchenType;
};

type CreateKitchenFormProps = {
  onSubmit: (values: KitchenFormValues) => void;
};

export function CreateKitchenForm({ onSubmit }: CreateKitchenFormProps) {
  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const values: KitchenFormValues = {
      width: Number(formData.get("width")),
      length: Number(formData.get("length")),
      height: Number(formData.get("height")),
      type: formData.get("type") as KitchenType,
    };

    onSubmit(values);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <h1 className="text-2xl font-bold text-[#303a32]">Create kitchen</h1>
        <p className="mt-1 text-sm text-gray-500">
          Set the kitchen dimensions.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { name: "width", label: "Width" },
          { name: "length", label: "Length" },
          { name: "height", label: "Height" },
        ].map((field) => (
          <label
            key={field.name}
            className="block text-sm font-semibold text-[#52684f]"
          >
            {field.label}
            <div className="mt-1 flex items-center rounded-md border border-[#728071] bg-white focus-within:ring-2 focus-within:ring-[#728071]">
              <input
                className="min-w-0 flex-1 bg-transparent px-3 py-2 outline-none"
                min="1"
                name={field.name}
                required
                type="number"
              />
              <span className="pr-3 text-xs text-gray-500">mm</span>
            </div>
          </label>
        ))}
      </div>

      <fieldset>
        <legend className="text-sm font-semibold text-[#52684f]">
          Kitchen type
        </legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {(["|", "L", "U"] as KitchenType[]).map((type) => (
            <label key={type} className="cursor-pointer">
              <input
                className="peer sr-only"
                defaultChecked={type === "|"}
                name="type"
                required
                type="radio"
                value={type}
              />
              <span className="flex justify-center rounded-md border border-[#d4dfd0] px-4 py-2 text-lg font-bold text-[#52684f] transition peer-checked:border-[#728071] peer-checked:bg-[#e8eee3] peer-checked:ring-2 peer-checked:ring-[#728071]">
                [ {type} ] kitchen
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <button
        className="w-full rounded-md bg-[#728071] px-4 py-2 text-base font-semibold text-white shadow-sm transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#728071] active:scale-[0.99]"
        type="submit"
      >
        Create kitchen
      </button>
    </form>
  );
}
