import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { showConfirm, showToast } from '../../components/AppLayout';
import { api } from '../../api';

export default function AirportsTab() {
  const [airports, setAirports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAirport, setEditingAirport] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ ma_sb: '', ten_sb: '', thanh_pho: '', quoc_gia: 'Vietnam' });

  const fetchAirports = async () => {
    setLoading(true);
    try {
      const data = await api.getAirports();
      setAirports(data);
    } catch {
      showToast('Không thể tải danh sách sân bay', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAirports(); }, []);

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingAirport(item);
      setFormData({ ma_sb: item.code || item.id, ten_sb: item.name, thanh_pho: item.city || '', quoc_gia: item.country || 'Vietnam' });
    } else {
      setEditingAirport(null);
      setFormData({ ma_sb: '', ten_sb: '', thanh_pho: '', quoc_gia: 'Vietnam' });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.ma_sb || !formData.ten_sb) {
      showToast('Vui lòng nhập đầy đủ Mã sân bay và Tên sân bay', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editingAirport) {
        await api.updateAirport(editingAirport.id, { ten_sb: formData.ten_sb, thanh_pho: formData.thanh_pho, quoc_gia: formData.quoc_gia });
        showToast('Cập nhật thông tin sân bay thành công!', 'success');
      } else {
        await api.createAirport({ ma_sb: formData.ma_sb.toUpperCase(), ten_sb: formData.ten_sb, thanh_pho: formData.thanh_pho, quoc_gia: formData.quoc_gia });
        showToast('Đã thêm sân bay mới!', 'success');
      }
      await fetchAirports();
      setShowModal(false);
    } catch (e: any) {
      showToast(e.message || 'Có lỗi xảy ra', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    showConfirm(`Bạn có chắc chắn muốn xóa sân bay "${name}"?`, async () => {
      try {
        await api.deleteAirport(id);
        showToast('Đã xóa sân bay thành công', 'success');
        await fetchAirports();
      } catch {
        showToast('Không thể xóa sân bay này (có thể đang được sử dụng trong tuyến bay)', 'error');
      }
    }, 'Xóa sân bay');
  };

  return (
    <Card className="settings-card">
      <div className="card-header">
        <h3>Danh mục Sân bay</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" variant="outline" onClick={fetchAirports}><span className="material-icons-round" style={{ fontSize: 16 }}>refresh</span></Button>
          <Button size="sm" onClick={() => handleOpenModal()}><span className="material-icons-round">add</span> Thêm sân bay</Button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
          <span className="material-icons-round" style={{ fontSize: 40 }}>hourglass_top</span>
          <p style={{ marginTop: 8 }}>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="premium-table">
            <thead>
              <tr>
                <th>SÂN BAY</th>
                <th>MÃ</th>
                <th>THÀNH PHỐ</th>
                <th>QUỐC GIA</th>
                <th>TRẠNG THÁI</th>
                <th>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {airports.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>Chưa có dữ liệu</td></tr>
              ) : airports.map(a => (
                <tr key={a.id}>
                  <td><b>{a.name}</b></td>
                  <td><code className="mono">{a.code}</code></td>
                  <td>{a.city}</td>
                  <td>{a.country}</td>
                  <td>
                    <span className={`status-badge ${a.status === 'active' ? 'active' : 'inactive'}`}>
                      {a.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
                    </span>
                  </td>
                  <td>
                    <div className="action-row">
                      <button className="icon-btn" onClick={() => handleOpenModal(a)}><span className="material-icons-round">edit</span></button>
                      <button className="icon-btn delete" onClick={() => handleDelete(a.id, a.name)}><span className="material-icons-round">delete</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>{editingAirport ? 'Sửa sân bay' : 'Thêm sân bay mới'}</h3>
            {!editingAirport && (
              <div className="form-group mt-md">
                <label>Mã sân bay (IATA) <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="text" value={formData.ma_sb} maxLength={10}
                  onChange={e => setFormData({ ...formData, ma_sb: e.target.value.toUpperCase() })}
                  className="input-field" placeholder="VD: HAN, SGN, DAD" />
              </div>
            )}
            <div className="form-group mt-md">
              <label>Tên sân bay <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="text" value={formData.ten_sb}
                onChange={e => setFormData({ ...formData, ten_sb: e.target.value })}
                className="input-field" placeholder="VD: Nội Bài" />
            </div>
            <div className="form-group mt-md">
              <label>Thành phố</label>
              <input type="text" value={formData.thanh_pho}
                onChange={e => setFormData({ ...formData, thanh_pho: e.target.value })}
                className="input-field" placeholder="VD: Hà Nội" />
            </div>
            <div className="form-group mt-md">
              <label>Quốc gia</label>
              <input type="text" value={formData.quoc_gia}
                onChange={e => setFormData({ ...formData, quoc_gia: e.target.value })}
                className="input-field" />
            </div>
            <div className="modal-actions mt-lg">
              <Button variant="outline" onClick={() => setShowModal(false)}>Hủy</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
