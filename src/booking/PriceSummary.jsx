import { PRICE_MAP } from "../Components/utils/pricing";

const PriceSummary = ({ persons, total }) => (
  <aside className="bg-gray-50 p-4 rounded-xl">
    <h4 className="font-semibold mb-2">Price Summary</h4>

    {persons.map((p, i) => (
      <div key={i} className="flex justify-between text-sm">
        <span>{p.name} ({p.type})</span>
        <span>₹{PRICE_MAP[p.type]}</span>
      </div>
    ))}

    <hr className="my-2" />
    <div className="flex justify-between font-bold">
      <span>Total</span>
      <span>₹{total}</span>
    </div>
  </aside>
);

export default PriceSummary;
