const colorsArray = ['#A2D2FF', '#B7E4C7', '#FFB5A7', '#CDB4DB', '#FFE066', '#FF70A6', '#DDE5B6', '#118AB2', '#F4A261', '#CED4DA', '#2A9D8F', '#E76F51', '#9DADF2', '#FFF3B0'];


export const randomColor = () => {
    const index = Math.floor(Math.random() * colorsArray.length);
    return colorsArray[index];
}
