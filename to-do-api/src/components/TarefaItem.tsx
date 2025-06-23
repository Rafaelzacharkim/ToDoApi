type Props = {
    tarefa: {
        id: number;
        titulo: string;
        concluida: boolean;
    };
    onToggle: () => void;
    onDelete: () => void;
};

export default function TarefaItem({ tarefa, onToggle, onDelete }: Props) {
    return (
        <li>
            <span style={{ textDecoration: tarefa.concluida ? "line-through" : "none" }}>
                {tarefa.titulo}
            </span>
            <button onClick={onToggle}>✓</button>
            <button onClick={onDelete}>🗑</button>
        </li>
    );
}
