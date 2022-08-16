const toCommandChoices = (o: any) =>
    Object.values(o)
        .filter((v) => isNaN(Number(v)))
        .map((v: any) => ({
            name: v.toString(),
            value: v.toString()
        }));

export default toCommandChoices;