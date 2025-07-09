from app.models import Base
from app.config import settings
from sqlalchemy import create_engine

def main():
    print("初始化数据库: " + settings.DATABASE_URL)
    engine = create_engine(settings.DATABASE_URL)
    Base.metadata.create_all(engine)
    print("所有表已创建完成。")

if __name__ == '__main__':
    main()
