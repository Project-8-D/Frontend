﻿// <auto-generated />
using System;
using Api.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Api.Migrations
{
    [DbContext(typeof(SqliteDbContext))]
    partial class SqliteDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "6.0.5");

            modelBuilder.Entity("Api.Database.Models.Test", b =>
                {
                    b.Property<Guid>("Guid")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.HasKey("Guid");

                    b.ToTable("Test");
                });
#pragma warning restore 612, 618
        }
    }
}
