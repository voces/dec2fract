const input = document.querySelector("input");
const pre = document.querySelector("pre");

const format = (target, approx) => {
	target = target.toString();
	approx = approx.toString();

	let match = 0;
	while (
		match < target.length &&
		match < approx.length &&
		target[match] === approx[match]
	)
		match++;

	return `<span class="match">${approx.slice(0, match)}</span>${approx.slice(
		match,
	)}`;
};

const fractToDec = (fract) => {
	const [n, d] = fract.split("/").map((v) => parseFloat(v));
	return n / d;
};

const calculate = () => {
	const target = input.value.includes("/")
		? fractToDec(input.value)
		: parseFloat(input.value);

	if (isNaN(target)) return;

	if (target === Math.floor(target))
		return (pre.innerHTML = `${target}/1 = ${target}`);

	const approximations = [];

	let z = target;
	let n = 0;
	let dPrev = 0;
	let d = 1;
	let approx = n / d;

	while (approx !== target && approximations.length < 250) {
		z = 1 / (z - Math.floor(z));
		const dCopy = d;
		d = d * Math.floor(z) + dPrev;
		dPrev = dCopy;
		n = Math.round(target * d);
		approx = n / d;

		const hit = approx.toString().startsWith(target);

		approximations.push(
			`<span class=${hit ? "hit" : ""}>${n}/${d} = ${format(
				target,
				approx,
			)}</span>`,
		);
	}

	pre.innerHTML = approximations.join("\n");
};

input.addEventListener("keyup", calculate);

input.select();
calculate();