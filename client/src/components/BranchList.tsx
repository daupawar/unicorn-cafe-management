type Branch = {
  _id?: string;
  name: string;
  location: string;
  owner: string;
  address: string;
  openingDate: string;
  isActive: boolean;
  comment: string;
};

const BranchList = ({
  branches,
  onEdit,
  onDelete,
}: {
  branches: Branch[];
  onEdit?: (branch: Branch) => void;
  onDelete?: (id?: string) => void;
}) => (
  <div>
    <h2>Branch List</h2>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Location</th>
          <th>Owner</th>
          <th>Address</th>
          <th>Opening Date</th>
          <th>Active</th>
          <th>Comment</th>
          {(onEdit || onDelete) && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {branches.map((branch) => (
          <tr key={branch._id}>
            <td>{branch.name}</td>
            <td>{branch.location}</td>
            <td>{branch.owner}</td>
            <td>{branch.address}</td>
            <td>{branch.openingDate?.slice(0, 10)}</td>
            <td>{branch.isActive ? 'Yes' : 'No'}</td>
            <td>{branch.comment}</td>
            {(onEdit || onDelete) && (
              <td>
                {onEdit && (
                  <button onClick={() => onEdit(branch)} style={{ marginRight: 8 }}>
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button onClick={() => onDelete(branch._id)}>
                    Delete
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default BranchList;