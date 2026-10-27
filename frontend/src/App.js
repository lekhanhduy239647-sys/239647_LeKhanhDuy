import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/employees';

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    employeeId: '',
    fullName: '',
    gender: 'Nam',
    dateOfBirth: '',
    department: '',
    position: '',
    email: '',
    phone: '',
    hireDate: '',
    status: 'Đang làm việc'
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}?search=${search}`);
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
        setMessage('Cập nhật thông tin nhân viên thành công!');
      } else {
        await axios.post(API_URL, form);
        setMessage('Thêm nhân viên mới thành công!');
      }
      setForm({
        employeeId: '',
        fullName: '',
        gender: 'Nam',
        dateOfBirth: '',
        department: '',
        position: '',
        email: '',
        phone: '',
        hireDate: '',
        status: 'Đang làm việc'
      });
      setEditingId(null);
      fetchEmployees();
    } catch (err) {
      setMessage('Lỗi: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (emp) => {
    setForm(emp);
    setEditingId(emp._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hồ sơ nhân viên này không?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setMessage('Xóa nhân viên thành công!');
        fetchEmployees();
      } catch (err) {
        setMessage('Lỗi khi xóa nhân viên');
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>HỆ THỐNG QUẢN LÝ NHÂN SỰ</h2>
      
      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}

      <form onSubmit={handleSubmit} style={{ background: '#f4f4f4', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
        <h3>{editingId ? 'Cập nhật thông tin nhân viên' : 'Thêm nhân viên mới'}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          <input placeholder="Mã NV *" value={form.employeeId} onChange={e => setForm({...form, employeeId: e.target.value})} required />
          <input placeholder="Họ tên *" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} required />
          <input placeholder="Email *" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <input placeholder="Phòng ban" value={form.department} onChange={e => setForm({...form, department: e.target.value})} />
          <input placeholder="Chức vụ" value={form.position} onChange={e => setForm({...form, position: e.target.value})} />
          <input placeholder="Số điện thoại" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <input placeholder="Ngày sinh (YYYY-MM-DD)" value={form.dateOfBirth} onChange={e => setForm({...form, dateOfBirth: e.target.value})} />
          <input placeholder="Ngày vào làm (YYYY-MM-DD)" value={form.hireDate} onChange={e => setForm({...form, hireDate: e.target.value})} />
          <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
            <option value="Đang làm việc">Đang làm việc</option>
            <option value="Tạm nghỉ">Tạm nghỉ</option>
            <option value="Đã nghỉ việc">Đã nghỉ việc</option>
          </select>
        </div>
        <div style={{ marginTop: '10px' }}>
          <button type="submit" style={{ padding: '8px 15px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}>
            {editingId ? 'Lưu thay đổi' : 'Thêm nhân viên'}
          </button>
          {editingId && (
            <button 
              type="button" 
              onClick={() => { 
                setEditingId(null); 
                setForm({ employeeId: '', fullName: '', gender: 'Nam', dateOfBirth: '', department: '', position: '', email: '', phone: '', hireDate: '', status: 'Đang làm việc' }); 
              }} 
              style={{ marginLeft: '10px', padding: '8px 15px', cursor: 'pointer' }}
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      <div style={{ marginBottom: '15px' }}>
        <input 
          type="text" 
          placeholder="Tìm kiếm theo mã nhân viên hoặc họ tên..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#ddd' }}>
            <th>Mã NV</th>
            <th>Họ tên</th>
            <th>Phòng ban</th>
            <th>Chức vụ</th>
            <th>Email</th>
            <th>SĐT</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp._id}>
              <td>{emp.employeeId}</td>
              <td>{emp.fullName}</td>
              <td>{emp.department}</td>
              <td>{emp.position}</td>
              <td>{emp.email}</td>
              <td>{emp.phone}</td>
              <td>{emp.status}</td>
              <td>
                <button onClick={() => handleEdit(emp)} style={{ marginRight: '5px', cursor: 'pointer' }}>Sửa</button>
                <button onClick={() => handleDelete(emp._id)} style={{ color: 'red', cursor: 'pointer' }}>Xóa</button>
              </td>
            </tr>
          ))}
          {employees.length === 0 && (
            <tr><td colSpan="8" style={{ textAlign: 'center' }}>Không tìm thấy nhân viên nào</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;