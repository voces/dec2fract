const input = document.querySelector("input");
const link = document.querySelector(".link");
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

let last = 1.61;

const eval2 = (str) => {
	try {
		return parseFloat(eval(str));
	} catch (err) {
		return NaN;
	}
};

const getTarget = () =>
	isNaN(input.value) ? eval2(input.value) : parseFloat(input.value);

const calculate = () => {
	const target = getTarget();

	if (isNaN(target)) {
		input.setAttribute("placeholder", last);
		return;
	}

	last = target;

	link.setAttribute(
		"href",
		location.origin + location.pathname + "#" + target,
	);

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

input.addEventListener("input", calculate);

input.select();
calculate();

if (location.hash.length > 1) {
	const num = parseFloat(location.hash.slice(1));
	if (!isNaN(num)) input.value = num;
}

link.addEventListener("click", (e) => {
	const target = getTarget();
	if (isNaN(target)) return;
	const url = location.origin + location.pathname + "#" + target;
	const el = document.createElement("textarea");
	el.value = url;
	el.setAttribute("readonly", "");
	el.style.position = "absolute";
	el.style.left = "-9999px";
	document.body.appendChild(el);
	el.select();
	document.execCommand("copy");
	document.body.removeChild(el);

	const copied = document.createElement("span");
	copied.textContent = "Copied!";
	copied.classList.add("copied");
	copied.style.top = e.pageY + "px";
	copied.style.left = e.pageX + "px";
	document.body.append(copied);
	setTimeout(() => copied.classList.add("fade"), 1500);
	setTimeout(() => document.body.removeChild(copied), 2500);
});
