import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { showConfirm, showToast } from '../../components/AppLayout';
import { api } from '../../api';

export default function RoutesTab() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [airports, setAirports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ ma_tuyen: '', ma_sb_di: '', ma_sb_den: '', khoang_cach: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [routesData, airportsData] = await Promise.all([api.getRoutes(), api.getAirports()]);
      setRoutes(routesData);
      setAirports(airportsData);
    } catch {
      showToast('Không thể tải danh sách tuyến bay', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingRoute(item);
      setFormData({ ma_tuyen: item.id, ma_sb_di: item.from, ma_sb_den: item.to, khoang_cach: '' });
    } else {
      setEditingRoute(null);
      setFormData({ ma_tuyen: '', ma_sb_di: airports[0]?.code || 'HAN', ma_sb_den: '', khoang_cach: '' });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editingRoute && (!formData.ma_tuyen || !formData.ma_sb_di || !formData.ma_sb_den)) {
      showToast('Vui lòng nhập đầy đủ thông tin tuyến bay', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editingRoute) {
        await api.updateRoute(editingRoute.id, {
          khoang_cach: formData.khoang_cach ? parseFloat(formData.khoang_cach) : undefined
        });
        showToast('Cập nhật tuyến bay thành công!', 'success');
      } else {
        await api.createRoute({
          ma_tuyen: formData.ma_tuyen.toUpperCase(),
          ma_sb_di: formData.ma_sb_di.toUpperCase(),
          ma_sb_den: formData.ma_sb_den.toUpperCase(),
          khoang_cach: formData.khoang_cach ? parseFloat(formData.khoang_cach) : undefined
        });
        showToast('Đã thêm tuyến bay mới!', 'success');
      }
      await fetchData();
      setShowModal(false);
    } catch (e: any) {
      showToast(e.message || 'Có lỗi xảy ra', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    showConfirm(`Bạn có chắc chắn muốn xóa tuyến bay "${id}"?`, async () => {
      try {
        await api.deleteRoute(id);
        showToast('Đã xóa tuyến bay thành công', 'success');
        await fetchData();
      } catch {
        showToast('Không thể xóa tuyến bay này (có thể đang có chuyến bay đang sử dụng)', 'error');
      }
    }, 'Xóa tuyến bay');
  };

  const typeBadge = (type: string) => type === 'Quốc tế'
    ? { background: '#eff6ff', color: '#2563eb' }
    : { background: '#f0fdf4', color: '#16a34a' };

  return (
    <Card className="settings-card">
      <div className="card-header">
        <h3>Danh mục Tuyến bay</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" variant="outline" onClick={fetchData}><span className="material-icons-round" style={{ fontSize: 16 }}>refresh</span></Button>
          <Button size="sm" onClick={() => handleOpenModal()}><span className="material-icons-round">add</span> Thêm tuyến</Button>
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
                <th>MÃ TUYẾN</th>
                <th>HÀNH TRÌNH</th>
                <th>KHOẢNG CÁCH</th>
                <th>BAY LÂU</th>
                <th>LOẠI</th>
                <th>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {routes.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>Chưa có dữ liệu</td></tr>
              ) : routes.map(r => (
                <tr key={r.id}>
                  <td><code className="mono">{r.id}</code></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                      <span>{r.from}</span>
                      <span className="material-icons-round" style={{ fontSize: 16, color: '#94a3b8' }}>flight_takeoff</span>
                      <span>{r.to}</span>
                    </div>
                  </td>
                  <td>{r.distance}</td>
                  <td>{r.duration}</td>
                  <td>
                    <span style={{ ...typeBadge(r.type), padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                      {r.type}
                    </span>
                  </td>
                  <td>
                    <div className="action-row">
                      <button className="icon-btn" onClick={() => handleOpenModal(r)}><span className="material-icons-round">edit</span></button>
                      <button className="icon-btn delete" onClick={() => handleDelete(r.id)}><span className="material-icons-round">delete</span></button>
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
            <h3>{editingRoute ? `Sửa tuyến ${editingRoute.id}` : 'Thêm tuyến bay mới'}</h3>
            {!editingRoute && (
              <>
                <div className="form-group mt-md">
                  <label>Mã tuyến <span style={{ color: '#ef4444' }}>*</span></label>
                  <input type="text" value={formData.ma_tuyen} maxLength={10}
                    onChange={e => setFormData({ ...formData, ma_tuyen: e.target.value.toUpperCase() })}
                    className="input-field" placeholder="VD: HAN-SGN" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                  <div className="form-group">
                    <label>Sân bay đi <span style={{ color: '#ef4444' }}>*</span></label>
                    <select value={formData.ma_sb_di}
                      onChange={e => setFormData({ ...formData, ma_sb_di: e.target.value })}
                      className="input-field">
                      {airports.map(a => <option key={a.code} value={a.code}>{a.code} - {a.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Sân bay đến <span style={{ color: '#ef4444' }}>*</span></label>
                    <select value={formData.ma_sb_den}
                      onChange={e => setFormData({ ...formData, ma_sb_den: e.target.value })}
                      className="input-field">
                      <option value="">-- Chọn sân bay --</option>
                      {airports.map(a => <option key={a.code} value={a.code}>{a.code} - {a.name}</option>)}
                    </select>
                  </div>
                </div>
              </>
            )}
            <div className="form-group mt-md">
              <label>Khoảng cách (km)</label>
              <input type="number" value={formData.khoang_cach}
                onChange={e => setFormData({ ...formData, khoang_cach: e.target.value })}
                className="input-field" placeholder="VD: 1170" />
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
