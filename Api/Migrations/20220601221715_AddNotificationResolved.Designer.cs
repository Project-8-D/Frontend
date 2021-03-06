// <auto-generated />
using System;
using Api.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Api.Migrations
{
    [DbContext(typeof(SqliteDbContext))]
    [Migration("20220601221715_AddNotificationResolved")]
    partial class AddNotificationResolved
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "6.0.5");

            modelBuilder.Entity("Api.Database.Models.Notification", b =>
                {
                    b.Property<Guid>("Guid")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<double>("Latitude")
                        .HasColumnType("REAL");

                    b.Property<double>("Longitude")
                        .HasColumnType("REAL");

                    b.Property<int>("NodeId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Probability")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("Resolved")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Sound")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("SoundType")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<ulong>("Time")
                        .HasColumnType("INTEGER");

                    b.HasKey("Guid");

                    b.ToTable("Notifications");
                });

            modelBuilder.Entity("Api.Database.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Email")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<string>("Password")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });
#pragma warning restore 612, 618
        }
    }
}
