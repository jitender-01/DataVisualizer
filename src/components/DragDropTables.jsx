import React, { useState, useRef } from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { X, GripHorizontal } from "lucide-react";

const mockTables = [
  {
    id: "employees",
    name: "Employees",
    columns: [
      { column_id: "emp_id", name: "ID", column_data_type: "integer" },
      { column_id: "emp_name", name: "Name", column_data_type: "string" },
    ],
  },
  {
    id: "patients",
    name: "Patients",
    columns: [
      { column_id: "pat_id", name: "ID", column_data_type: "integer" },
      { column_id: "pat_name", name: "Name", column_data_type: "string" },
    ],
  },
];

const Sidebar = ({ tables, onDragStart }) => (
  <div className="sidebar">
    <h3>Tables</h3>
    {tables.map((table) => (
      <div
        key={table.id}
        className="draggable-table"
        draggable
        onDragStart={(e) => onDragStart(e, table)}
      >
        {table.name}
      </div>
    ))}
  </div>
);

const TableGrid = ({ tables, onDrop, onRemove, onMove }) => {
  const gridRef = useRef(null);

  return (
    <div
      ref={gridRef}
      className="grid"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, gridRef)}
    >
      {tables.map((table) => (
        <ResizableBox
          key={table.id}
          width={200}
          height={150}
          minConstraints={[150, 100]}
          maxConstraints={[400, 300]}
          className="table-box"
          style={{ left: table.position.x, top: table.position.y }}
        >
          <div
            className="table-header cursor-move"
            onMouseDown={(e) => onMove(e, table.id)}
          >
            <GripHorizontal className="mr-2" />
            {table.name}
            <button className="remove-btn" onClick={() => onRemove(table.id)}>
              <X size={16} />
            </button>
          </div>
          <div className="tableData">
            <div className="data"><b>Columns</b></div>
            <div className="data"><b>DataTypes</b></div>
          </div>
          <div className="tableRow">
            {table.columns.map((col) => (
              <div className="tableData" key={col.column_id}>
                <div className="data">{col.name}</div>
                <div className="data">{col.column_data_type}</div>
              </div>
            ))}
          </div>
        </ResizableBox>
      ))}
    </div>
  );
};

const DragDropTables = () => {
  const [gridTables, setGridTables] = useState([]);

  const handleDragStart = (event, table) => {
    event.dataTransfer.setData("table", JSON.stringify(table));
  };

  const handleDrop = (event, gridRef) => {
    event.preventDefault();
    const table = JSON.parse(event.dataTransfer.getData("table"));
  
    if (gridTables.some((t) => t.id === table.id)) {
      alert("Table already exists in grid!");
      return;
    }
  
    const rect = gridRef.current.getBoundingClientRect();
    
    // Calculate correct position relative to the grid
    const x = event.clientX - rect.left - 100; // Adjust for centering
    const y = event.clientY - rect.top - 50;  // Adjust for centering
  
    setGridTables([...gridTables, { ...table, position: { x, y } }]);
  };
  

  const handleRemoveTable = (tableId) => {
    setGridTables(gridTables.filter((t) => t.id !== tableId));
  };

  const handleTableMove = (event, tableId) => {
    event.preventDefault();
  
    const rect = event.target.closest(".table-box").getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
  
    const moveHandler = (moveEvent) => {
      const newX = moveEvent.clientX - offsetX;
      const newY = moveEvent.clientY - offsetY;
  
      setGridTables((prev) =>
        prev.map((table) =>
          table.id === tableId
            ? { ...table, position: { x: newX, y: newY } }
            : table
        )
      );
    };
  
    document.addEventListener("mousemove", moveHandler);
    document.addEventListener(
      "mouseup",
      () => {
        document.removeEventListener("mousemove", moveHandler);
      },
      { once: true }
    );
  };
  

  return (
    <div className="container">
      <Sidebar tables={mockTables} onDragStart={handleDragStart} />
      <TableGrid
        tables={gridTables}
        onDrop={handleDrop}
        onRemove={handleRemoveTable}
        onMove={handleTableMove}
      />
    </div>
  );
};

export default DragDropTables;
