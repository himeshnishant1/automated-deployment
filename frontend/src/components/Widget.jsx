import PropTypes from 'prop-types';

function Widget({ title, description, children }) {
  return (
    <div className="widget-card">
      <h3 className="widget-title">{title}</h3>
      <p className="widget-description">{description}</p>
      <div className="widget-content">
        {children || (
          <div className="widget-placeholder">
            <p>Widget content coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}


Widget.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default Widget; 